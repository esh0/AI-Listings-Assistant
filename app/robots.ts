import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/pricing", "/regulamin", "/polityka-prywatnosci"],
                disallow: ["/dashboard/", "/api/", "/auth/"],
            },
        ],
        sitemap: "https://marketplace-ai.pl/sitemap.xml",
    };
}
