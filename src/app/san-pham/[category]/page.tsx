'use client';

import { useParams, redirect } from 'next/navigation';

export default function CategoryRedirect() {
  const params = useParams();
  const categorySlug = params.category as string;
  redirect(`/san-pham?danh-muc=${categorySlug}`);
}
