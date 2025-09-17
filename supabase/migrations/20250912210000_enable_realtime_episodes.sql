-- Enable realtime for episodes table
alter publication supabase_realtime add table episodes;

-- Enable realtime for content table
alter publication supabase_realtime add table content;