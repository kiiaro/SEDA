/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SEDA - Cliente Supabase para Autenticação e Banco de Dados
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wxsiysmxcpwcdordwxpp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c2l5c214Y3B3Y2RvcmR3eHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4NzI2NTAsImV4cCI6MjA0NDQ0ODY1MH0.sb_publishable_oj0yvS9SMeQ0tmCxuPXSjw_HdmBxqHH';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const SUPABASE_CONFIG = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_KEY,
};
