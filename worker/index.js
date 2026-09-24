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
      return json({ ok: true, service: "SDN Muarasari 1 API", status: "running" });
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
      if (env.DB) {
        const result = await env.DB.prepare(
          "SELECT * FROM content ORDER BY created_at DESC"
        ).all();

        return json({ success: true, data: result.results });
      }

      return json({ success: true, data: [], mode: "fallback" });
    }

    if (url.pathname === "/api/content" && request.method === "POST") {
      const body = await request.json().catch(() => null);

      if (!body?.title || !body?.type) {
        return json({ success: false, message: "title dan type wajib diisi" }, 400);
      }

      if (env.DB) {
        await env.DB.prepare(
          "INSERT INTO content (type,title,body,image) VALUES (?,?,?,?)"
        )
          .bind(body.type, body.title, body.body || "", body.image || "")
          .run();
      }

      return json({ success: true, data: body }, 201);
    }

    if (url.pathname.startsWith("/api/content/") && request.method === "DELETE") {
      const id = url.pathname.split("/").pop();

      if (env.DB) {
        await env.DB.prepare("DELETE FROM content WHERE id = ?").bind(id).run();
      }

      return json({ success: true, message: "Konten dihapus" });
    }

    return json({ success: false, message: "Endpoint tidak ditemukan" }, 404);
  },
};
