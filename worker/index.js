export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const json = (data, status = 200) =>
      Response.json(data, {
        status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        service: "SDN Muarasari 1 API",
        status: "running",
      });
    }

    if (url.pathname === "/api/site") {
      return json({
        name: env.SCHOOL_NAME || "SD Negeri Muarasari 1",
        npsn: env.NPSN || "20220471",
        city: "Kota Bogor",
      });
    }

    if (url.pathname === "/api/admin/status") {
      return json({
        authenticated: false,
        message: "Admin authentication module ready",
      });
    }

    if (url.pathname === "/api/content" && request.method === "GET") {
      return json({
        success: true,
        data: [],
        message: "Content list ready",
      });
    }

    if (url.pathname === "/api/content" && request.method === "POST") {
      const body = await request.json().catch(() => null);

      if (!body) {
        return json({
          success: false,
          message: "Data konten tidak valid",
        }, 400);
      }

      return json({
        success: true,
        message: "Konten siap disimpan ke database",
        data: body,
      }, 201);
    }

    if (url.pathname.startsWith("/api/content/") && request.method === "DELETE") {
      return json({
        success: true,
        message: "Konten siap dihapus",
      });
    }

    return json({
      success: false,
      message: "Endpoint tidak ditemukan",
    }, 404);
  },
};
