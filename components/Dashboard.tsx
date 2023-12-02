import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import React from "react";
import { SaveIcon } from "./Icons/Save";
import { DeleteIcon } from "./Icons/Delete";
import { EditIcon } from "./Icons/Edit";

interface DashboardProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<null | User>>;
}

export default function Dashboard({user, setUser}: Readonly<DashboardProps>) {
    const [links, setLinks] = React.useState<{
        created_at: string
        id: number
        link: string
    }[]>([]);
    const [edit, setEdit] = React.useState<number>(-1);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if(error) console.log(error);
        else setUser(null);
    }

    const handleAdd = async () => {
        const { data, error } = await supabase.from('links').insert([{ link: 'https://google.com' }]).select();

        if(error) console.log(error);
        if(data) setLinks([...links, ...data]);
    }


    React.useEffect(() => {
        const getLinks = async () => {
            const { data, error } = await supabase.from('links').select('*').order('id', { ascending: true });

            if(error) console.log(error);
            if(data && data?.length > 0) setLinks(data);
        }

        getLinks();
    }, [])

    return (
        <div>
            <h1 className="text-5xl text-emerald-200 font-bold text-center">Link manager</h1>
            <p className="mt-4 text-emerald-200 text-center text-xl">Welcome, {user?.email}</p>
            {/** Table with ID, and link with edit/save/delete buttons */}
            <table className="table-auto w-full mt-4">
                <thead>
                    <tr className="flex flex-row w-full">
                        <th className="px-4 py-2 text-emerald-200">ID</th>
                        <th className="px-4 py-2 text-emerald-200">Link</th>
                    </tr>
                </thead>
                <tbody>
                    {links.map((link, index) => (
                        <tr key={link.id} className="flex flex-row w-full">
                            <td className="border px-4 py-4 text-emerald-200 flex flex-row items-center border-emerald-700 id">#{link.id}</td>
                            <td className="border px-4 py-4 text-emerald-200 flex flex-row items-center border-emerald-700 w-[40vw] max-w-[40vw] overflow-x-auto">
                                {edit === index ? (
                                    <input
                                        className="px-4 py-2 border-2 text-emerald-400 placeholder-emerald-600 bg-emerald-950 border-emerald-900 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                                        type="text"
                                        value={link.link}
                                        onChange={(e) => setLinks(links.map((l, i) => i === index ? {...l, link: e.target.value} : l))}
                                    />
                                ) : <p className="pr-4">{link.link}</p>}
                            </td>
                            <td className="border px-4 py-4 text-emerald-200 flex flex-row items-center border-emerald-700">
                                {edit === index ? (
                                    <React.Fragment>
                                        <button
                                            className="mr-2"
                                            onClick={() => {
                                                setEdit(-1);
                                                const updateLink = async () => {
                                                    const { error } = await supabase.from('links').update({ link: link.link }).match({ id: link.id });

                                                    if(error) console.log(error);
                                                }

                                                updateLink();
                                            }}
                                        >
                                            <SaveIcon />
                                        </button>
                                        <button
                                            onClick={() => setEdit(-1)}
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <button
                                            className="mr-2"
                                            onClick={() => setEdit(index)}
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const deleteLink = async () => {
                                                    const { error } = await supabase.from('links').delete().match({ id: link.id });

                                                    if(error) console.log(error);
                                                    else setLinks(links.filter((l, i) => i !== index));
                                                }

                                                deleteLink();
                                            }}
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </React.Fragment>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                className="mt-6 w-full py-3 bg-emerald-400 text-emerald-950 font-bold rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                onClick={handleAdd}
            >
                Add link
            </button>
        </div>
    )   
}