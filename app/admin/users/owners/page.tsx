import { redirect } from "next/navigation"

// Redirect to the main owners management page
export default function UsersOwnersPage() {
  redirect("/admin/owners")
}
