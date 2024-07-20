# DBOS-Cloud: Fast and Free Automatic Supabase Table Copier

This is a simple DBOS app example focusing on remote deployment to DBOS Cloud, their hosted solution with a generous free tier for devs.

The github repo sets up a cron job which: 1) performs a "SELECT COUNT" on a Supabase Postgres database table and 2) an "INSERT" to a second table. Consider it a starter for a poor man's data lake aggregating data in the receiving table.

Note: This is not the fastest, most compact and recommended way to create this workflow. DBOS-Cloud has terrific in-app full Postgres database functionality. Check out the transactions section for more. I built the script this way since I had pre-existing data stored on Supabase.

Get more details on the [dev.to](https://dev.to/) article: [DBOS-Cloud: Fast and Free Automatic Supabase Table Copier](https://dev.to/dboscloud/dbos-cloud-fast-and-free-automatic-supabase-table-copier-1j2o)
