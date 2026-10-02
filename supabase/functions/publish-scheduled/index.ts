import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("posts")
    .update({ status: "published" })
    .eq("status", "scheduled")
    .lte("published_at", now)
    .select("id");

  if (error) {
    console.error("Error publishing scheduled posts:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  console.log(`Published ${data?.length ?? 0} scheduled posts`);
  return new Response(JSON.stringify({ published: data?.length ?? 0 }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
