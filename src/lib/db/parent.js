import {attributeMappings} from './keyword_mapping.js'
import { supabase } from './supabase.js';

// Function to insert a parent record
export const insertParent = async (parentData) => {
    const { data, error } = await supabase
      .from('parent')
      .insert([parentData])
      .single();
  
    if (error) {
      console.error('Error inserting parent:', error);
    } else {
      console.log('Parent inserted successfully:', data);
    }
  };