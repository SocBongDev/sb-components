import {attributeMappings} from './keyword_mapping.js'
import { supabase } from './supabase.js';

// Function to insert a class room record
export const insertClassRoom = async (classRoomData) => {
  const { data, error } = await supabase
    .from('class_room')
    .insert([classRoomData])
    .single();

  if (error) {
    console.error('Error inserting class room:', error);
  } else {
    console.log('Class room inserted successfully:', data);
  }
};