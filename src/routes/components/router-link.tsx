import { forwardRef } from "react";
import { Link } from "react-router";
import type { LinkProps } from "react-router";

// ----------------------------------------------------------------------

// Adapter: MUI passes `href`, React Router Link uses `to`
interface RouterLinkProps extends Omit<LinkProps, "to"> {
  href?: string;
}

export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ href = "", ...other }, ref) => <Link ref={ref} to={href} {...other} />,
);

RouterLink.displayName = "RouterLink";
