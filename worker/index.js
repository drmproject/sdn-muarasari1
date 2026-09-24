export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, service: "SDN Muarasari 1 API" });
    }

    if (url.pathname === "/api/site") {
      return Response.json({
        name: "SD Negeri Muarasari 1",
        npsn: "20220471",
        city: "Kota Bogor",
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
