-- Publica os posts agendados: a cada 5 minutos o pg_cron chama a edge function publish-scheduled.
-- (No Lovable esta tarefa existia fora das migrations.) A chave usada é a pública (anon) do projeto.
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
  PERFORM cron.unschedule('publish-scheduled-posts');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'publish-scheduled-posts',
  '*/5 * * * *',
  $cron$
  SELECT net.http_post(
    url := 'https://lbmpmjqsxyfqrismygoh.supabase.co/functions/v1/publish-scheduled',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibXBtanFzeHlmcXJpc215Z29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5ODM4NjcsImV4cCI6MjEwNjU1OTg2N30.OXmJmv5qVN6foklhVnsTvfcmUCBdfT1Rq0I-Ur6TVXw"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $cron$
);
