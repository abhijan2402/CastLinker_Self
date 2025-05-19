
import { supabase } from '@/integrations/supabase/client';

export const applyForJob = async (
  jobId: string, 
  userId: number | undefined, 
  application: {
    resume_url?: string;
    cover_letter?: string;
    additional_files?: string[];
  }
) => {
  if (!userId) {
    return {
      success: false,
      message: {
        title: 'Authentication required',
        description: 'Please log in to apply for jobs',
        variant: 'destructive' as const
      }
    };
  }

  try {
    const { error } = await (supabase
      .from('job_applications')
      .insert({
        user_id: userId,
        job_id: jobId,
        ...application
      }) as any);

    if (error) throw error;
    
    return {
      success: true,
      message: {
        title: 'Application submitted',
        description: 'Your application has been submitted successfully'
      }
    };
  } catch (error: any) {
    console.error('Error applying for job:', error);
    return {
      success: false,
      message: {
        title: 'Error',
        description: error.message || 'Failed to submit application',
        variant: 'destructive' as const
      }
    };
  }
};
