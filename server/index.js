import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import { Readable } from 'node:stream';
import { google } from 'googleapis';

dotenv.config();

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const PORT = Number(process.env.SERVER_PORT ?? 3032);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';
const DRIVE_ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

function getGoogleAuth() {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (credentialsPath) {
    return new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
  }

  if (clientEmail && privateKey) {
    return new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
  }

  throw new Error(
    'Google Drive credentials missing. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY.'
  );
}

async function getDriveClient() {
  const auth = getGoogleAuth();
  const authClient = await auth.getClient();
  return google.drive({ version: 'v3', auth: authClient });
}

async function findFolder(drive, name, parentId) {
  const escapedName = name.replace(/'/g, "\\'");
  const { data } = await drive.files.list({
    q: [
      `name = '${escapedName}'`,
      "mimeType = 'application/vnd.google-apps.folder'",
      "trashed = false",
      parentId ? `'${parentId}' in parents` : null,
    ]
      .filter(Boolean)
      .join(' and '),
    fields: 'files(id, name)',
    spaces: 'drive',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  return data.files?.[0] ?? null;
}

async function createFolder(drive, name, parentId) {
  const { data } = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId ? { parents: [parentId] } : {}),
    },
    fields: 'id, name',
    supportsAllDrives: true,
  });

  return data;
}

async function ensureFolder(drive, name, parentId) {
  const existing = await findFolder(drive, name, parentId);
  return existing ?? createFolder(drive, name, parentId);
}

function sanitizeFolderName(value) {
  return String(value ?? '')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .slice(0, 120);
}

function parseBillsPayload(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getPaymentFolderPlan(student, bills) {
  const now = new Date();
  const firstBill = bills[0] ?? {};
  const samePaymentType = bills.length > 0 && bills.every(
    (bill) =>
      bill.kodeJenisPembayaran === firstBill.kodeJenisPembayaran &&
      bill.namaJenisPembayaran === firstBill.namaJenisPembayaran,
  );
  const monthlyBills = bills.filter((bill) => bill.periodeBulan && bill.periodeTahun);

  const tahunAjaran = sanitizeFolderName(
    firstBill.tahunAjaran || String(firstBill.periodeTahun || now.getFullYear()),
  );
  const studentFolderName = sanitizeFolderName(`${student.namaLengkap} (${student.nis})`);
  const paymentFolderName = sanitizeFolderName(
    samePaymentType
      ? `${firstBill.kodeJenisPembayaran ?? 'TAGIHAN'} - ${firstBill.namaJenisPembayaran ?? 'Pembayaran'}`
      : 'Gabungan Pembayaran',
  );

  const folderNames = [tahunAjaran, studentFolderName, paymentFolderName];

  if (samePaymentType && monthlyBills.length) {
    const sameMonth = monthlyBills.every(
      (bill) =>
        bill.periodeBulan === monthlyBills[0].periodeBulan &&
        bill.periodeTahun === monthlyBills[0].periodeTahun,
    );

    folderNames.push(
      sameMonth
        ? `${MONTH_NAMES[monthlyBills[0].periodeBulan - 1]} ${monthlyBills[0].periodeTahun}`
        : 'Beberapa Bulan',
    );
  }

  return folderNames;
}

async function ensurePaymentFolder(drive, student, bills) {
  if (!DRIVE_ROOT_FOLDER_ID) {
    throw new Error('GOOGLE_DRIVE_ROOT_FOLDER_ID is missing.');
  }

  const folderNames = getPaymentFolderPlan(student, bills);
  let currentParentId = DRIVE_ROOT_FOLDER_ID;
  let currentFolder = null;

  for (const folderName of folderNames) {
    currentFolder = await ensureFolder(drive, folderName, currentParentId);
    currentParentId = currentFolder.id;
  }

  return currentFolder;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/google-drive/payment-proof', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send('File bukti pembayaran wajib diupload.');
      return;
    }

    const { studentId, nis, namaLengkap, totalBayar } = req.body;

    if (!studentId || !nis || !namaLengkap) {
      res.status(400).send('studentId, nis, dan namaLengkap wajib dikirim.');
      return;
    }

    const bills = parseBillsPayload(req.body.bills);
    const drive = await getDriveClient();
    const folder = await ensurePaymentFolder(drive, { nis, namaLengkap }, bills);
    const extension = req.file.originalname.includes('.')
      ? req.file.originalname.slice(req.file.originalname.lastIndexOf('.'))
      : '';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = sanitizeFolderName(`${timestamp}-${nis}-${totalBayar ?? 0}${extension}`);

    const { data } = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folder.id],
      },
      media: {
        mimeType: req.file.mimetype,
        body: Readable.from(req.file.buffer),
      },
      fields: 'id, webViewLink',
      supportsAllDrives: true,
    });

    res.json({
      fileId: data.id,
      folderId: folder.id,
      webViewLink: data.webViewLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : 'Gagal upload ke Google Drive.');
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
