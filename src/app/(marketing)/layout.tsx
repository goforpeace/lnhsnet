import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { FloatingActionButtons } from "@/components/shared/floating-action-buttons";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <FloatingActionButtons />
      <Footer />
    </div>
  )
}
