import { ReactNode } from "react";
import { Chapter, textbookLink } from "~/lib/chapters";

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-start gap-4 p-8">
      {children}
    </main>
  );
}

type PageTitleProps = { title: string; chapter: Chapter };

export function PageTitle({ title, chapter }: PageTitleProps) {
  return (
    <div>
      <h2 className="text-4xl font-semibold">{title}</h2>
      <p className="italic text-muted-foreground">
        As described in{" "}
        <a
          href={textbookLink(chapter.slug)}
          target="_blank"
          className="underline"
        >
          Chapter {chapter.index}: {chapter.name}
        </a>{" "}
        of Interactive Linear Algebra
      </p>
    </div>
  );
}
