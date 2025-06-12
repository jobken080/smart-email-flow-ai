
-- Enable RLS on emails table
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own emails
CREATE POLICY "Users can view their own emails" 
  ON public.emails 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own emails
CREATE POLICY "Users can create their own emails" 
  ON public.emails 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own emails
CREATE POLICY "Users can update their own emails" 
  ON public.emails 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own emails
CREATE POLICY "Users can delete their own emails" 
  ON public.emails 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on user_gmail_tokens table
ALTER TABLE public.user_gmail_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to manage their own Gmail tokens
CREATE POLICY "Users can manage their own Gmail tokens" 
  ON public.user_gmail_tokens 
  FOR ALL 
  USING (auth.uid() = user_id);
