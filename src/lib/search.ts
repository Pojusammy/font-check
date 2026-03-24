import { prisma } from "./prisma";

export async function searchFonts(query: string, limit = 10) {
  if (!query || query.trim().length === 0) return [];

  const q = query.trim();

  // Search across font_name and normalized_name using ILIKE
  const fonts = await prisma.font.findMany({
    where: {
      is_active: true,
      OR: [
        { font_name: { contains: q, mode: "insensitive" } },
        { normalized_name: { contains: q.toLowerCase().replace(/[^a-z0-9]/g, ""), mode: "insensitive" } },
        { family_name: { contains: q, mode: "insensitive" } },
        {
          aliases: {
            some: {
              OR: [
                { alias_name: { contains: q, mode: "insensitive" } },
                { normalized_alias_name: { contains: q.toLowerCase().replace(/[^a-z0-9]/g, ""), mode: "insensitive" } },
              ],
            },
          },
        },
      ],
    },
    select: {
      id: true,
      slug: true,
      font_name: true,
      vendor_name: true,
      personal_use_status: true,
      commercial_use_status: true,
      confidence_level: true,
    },
    take: limit,
    orderBy: [{ font_name: "asc" }],
  });

  return fonts;
}

export async function getFontBySlug(slug: string) {
  return prisma.font.findUnique({
    where: { slug, is_active: true },
    include: {
      aliases: true,
    },
  });
}
