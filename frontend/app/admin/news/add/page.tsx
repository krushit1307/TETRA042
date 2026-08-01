
"use client"

import { NewsForm } from "@/components/admin/news-form"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function AddNewsPage() {
    return (
        <AdminLayout
            title="Create New Article"
            description="Publish news to the Sasya AI network."
        >
            <NewsForm />
        </AdminLayout>
    )
}
