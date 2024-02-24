import { IconBrackets, IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";

export function Navbar() {
  return (
    <div className="flex items-center justify-between border-b border-border bg-muted px-8 py-4 dark:bg-muted/30">
      <Link href="/" className="flex items-center gap-2">
        <IconBrackets />
        <h1 className="text-xl font-bold leading-none">
          Concepts in Linear Algebra
        </h1>
      </Link>

      <a
        href="https://github.com/zsrobinson/linear"
        target="_blank"
        rel="noreferrer"
      >
        <IconBrandGithub />
      </a>
    </div>
  );
}
