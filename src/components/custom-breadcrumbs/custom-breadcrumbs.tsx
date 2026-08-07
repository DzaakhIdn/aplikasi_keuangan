import Breadcrumbs from "@mui/material/Breadcrumbs";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type ReactNode } from "react";

import { BackLink } from "./back-link";
import { MoreLinks } from "./more-links";
import { BreadcrumbsLink } from "./breadcrumb-link";
import {
  BreadcrumbsRoot,
  BreadcrumbsHeading,
  BreadcrumbsContent,
  BreadcrumbsContainer,
  BreadcrumbsSeparator,
} from "./styles";

// ----------------------------------------------------------------------

interface BreadcrumbLink {
  name?: string;
  href?: string;
  icon?: ReactNode;
}

interface CustomBreadcrumbsSlots {
  breadcrumbs?: ReactNode;
}

interface CustomBreadcrumbsSlotProps {
  heading?: Record<string, unknown>;
  breadcrumbs?: Record<string, unknown>;
  content?: Record<string, unknown>;
  container?: Record<string, unknown>;
  moreLinks?: Record<string, unknown>;
}

interface CustomBreadcrumbsProps {
  sx?: SxProps<Theme>;
  action?: ReactNode;
  backHref?: string;
  heading?: ReactNode;
  slots?: CustomBreadcrumbsSlots;
  links?: BreadcrumbLink[];
  moreLinks?: string[];
  slotProps?: CustomBreadcrumbsSlotProps;
  activeLast?: boolean;
  [key: string]: unknown;
}

export function CustomBreadcrumbs({
  sx,
  action,
  backHref,
  heading,
  slots = {},
  links = [],
  moreLinks = [],
  slotProps = {},
  activeLast = false,
  ...other
}: CustomBreadcrumbsProps) {
  const lastLink = links[links.length - 1]?.name;

  const renderHeading = () => (
    <BreadcrumbsHeading {...slotProps?.heading}>
      {backHref ? (
        <BackLink href={backHref} label={heading} sx={{}} />
      ) : (
        heading
      )}
    </BreadcrumbsHeading>
  );

  const renderLinks = () =>
    slots?.breadcrumbs ?? (
      <Breadcrumbs
        separator={<BreadcrumbsSeparator />}
        {...slotProps?.breadcrumbs}
      >
        {links.map((link, index) => (
          <BreadcrumbsLink
            key={link.name ?? index}
            icon={link.icon}
            href={link.href}
            name={link.name}
            disabled={link.name === lastLink && !activeLast}
          />
        ))}
      </Breadcrumbs>
    );

  const renderMoreLinks = () => (
    <MoreLinks links={moreLinks} {...slotProps?.moreLinks} />
  );

  return (
    <BreadcrumbsRoot sx={sx} {...other}>
      <BreadcrumbsContainer {...slotProps?.container}>
        <BreadcrumbsContent {...slotProps?.content}>
          {(heading || backHref) && renderHeading()}
          {(!!links.length || slots?.breadcrumbs) && renderLinks()}
        </BreadcrumbsContent>
        {action}
      </BreadcrumbsContainer>

      {!!moreLinks?.length && renderMoreLinks()}
    </BreadcrumbsRoot>
  );
}
