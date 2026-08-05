import { redirect } from "next/navigation";

export default function GDPRRequestRedirect() {
  redirect("/data-deletion");
}
