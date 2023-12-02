//:id -> Redirect to link in LINKS table 
import { supabase } from "@/lib/supabase";

import { redirect } from 'next/navigation'
 
async function fetchLink(id: string) {
    if(!id) return null;
    const res = await supabase.from('links').select().match({ id: parseInt(id) }).single();
    if(res.error || res.data === null) return null;
    return res.data;
}

export default async function Profile({ params }: Readonly<{ params: any }>) {
    const team = await fetchLink(params.id);
    
    if(team) {
        redirect(team.link);
    }else{
        redirect('/not-found');
    }

    return <></>;
}