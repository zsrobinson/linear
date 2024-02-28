import { IconBrackets, IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";

export function Navbar() {
  return (
    <div className="border-b border-border bg-muted dark:bg-muted/30">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-8 py-4">
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
    </div>
  );
}
