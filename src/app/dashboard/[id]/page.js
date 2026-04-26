import { Suspense } from "react";
import SnippetPageClient from "./SnippetPageClient";

export default function SnippetPage({ params }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="w-6 h-6 border-2 border-[#21262d] border-t-[#d2a8ff] rounded-full animate-spin"></div>
      </div>
    }>
      <SnippetPageClient params={params} />
    </Suspense>
  );
}
