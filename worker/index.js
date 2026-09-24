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
        name: "SD Negeri Muarasari 1",
        npsn: "20220471",
        city: "Kota Bogor",
      });
    }

    if (url.pathname === "/api/admin/status") {
      return json({
        authenticated: false,
        message: "Admin authentication module ready",
      });
    }

    if (url.pathname.startsWith("/api/content")) {
      return json({
        success: true,
        data: [],
        message: "Content API foundation ready",
      });
    }

    return json({
      success: false,
      message: "Endpoint tidak ditemukan",
    }, 404);
  },
};
