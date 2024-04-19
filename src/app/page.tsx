'use client';
import Mailjs from '@cemalgnlts/mailjs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Files, Check, RefreshCw, X, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import mail from '@/components/mail';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Message {
  id: string;
  subject: string;
  from: { address: string; name: string };
  content: string;
  intro: string;
  // Add other properties as needed
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [username, setUsername] = useState('');
  const [inbox, setInbox] = useState<Message[]>([]);
  const [openedMsg, setOpenMsg] = useState('');
  const copyToClipboard = () => {
    navigator.clipboard.writeText(username).then(() => {
      console.log('Username copied to clipboard:', username);
      setCopied(true);
    });
  };

  useEffect(() => {
    async function fetchUsername() {
      try {
        const fetchedUsername = await mail((msg: any) => {
          console.log(msg);
          setInbox((prevInbox) => [...prevInbox, msg]);
          console.log(inbox);

          // const data = mailjs.me()
        });
        setUsername(fetchedUsername.username);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUsername();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const fetchedUsername = await mail((msg: any) => {
        return;
      });
      await fetchedUsername.deleteAccount();
      // Account deleted successfully
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const inboxMsg = (id: any) => {
    console.log(id);
    const message = inbox.find((msg) => msg.id === id);
    console.log(message?.intro);
    setOpenMsg(JSON.stringify(message?.intro));
  };

  return (
    <div className='w-full text-center'>
      <div className='bg-[#24252d] p-12'>
        <div className='flex flex-col gap-3 text-white font-bold text-2xl border-dashed border-gray-700 p-10 rounded-2xl border-2 '>
          <h1>Your Temporary Email Address</h1>
          <div className='flex gap-2 items-center my-2'>
            <Input
              type='text'
              value={username}
              className='bg-[#24252d] bg-opacity-10 p-4 border-gray-700 rounded-xl'
              contentEditable={false}
              readOnly={true}
            />
            <Files
              size={30}
              onClick={copyToClipboard}
              className='cursor-pointer'
            />
          </div>
          {copied && (
            <p className='text-sm flex justify-center gap-1 items-center'>
              copied to clipbard <Check />
            </p>
          )}
        </div>
      </div>

      <div className='flex gap-6 justify-center items-center shadow-xl p-10'>
        <Button
          onClick={copyToClipboard}
          className=' flex gap-1 rounded-3xl shadow-xl text-lg p-6 bg-white text-black hover:text-white border-gray-200 border-2'
        >
          <Files />
          Copy
        </Button>
        <Button
          onClick={() => window.location.reload()}
          className=' flex gap-1 rounded-3xl shadow-xl text-lg p-6 bg-white text-black hover:text-white border-gray-200 border-2'
        >
          <RefreshCw />
          New Email
        </Button>
        <Button
          onClick={handleDeleteAccount}
          className=' flex gap-1 rounded-3xl shadow-xl text-lg p-6 bg-white text-black hover:text-white border-gray-200 border-2'
        >
          <X />
          Delete
        </Button>
      </div>
      <div className='m-10 flex flex-col items-center '>
        <div className='w-full bg-[#24252d] md:w-3/4 text-white p-4 rounded-xl'>
          <h1 className='font-bold text-2xl'>Inbox</h1>
        </div>
        <div className='w-full md:w-3/4 p-4 border-b-2 border-x-2 rounded-xl border-gray-200'>
          {!inbox || inbox.length === 0 ? (
            <h1 className='text-black'>No messages</h1>
          ) : (
            <div>
              {inbox.map((msg) => {
                return (
                  <div
                    onClick={() => inboxMsg(msg.id)}
                    key={msg.id}
                    className='flex-wrap flex flex-col md:flex-row justify-between gap-2 md:items-center hover:text-green-600'
                  >
                    <p className=' flex flex-col text-start text-sm font-medium hover:underline hover:cursor-pointer'>
                      {msg.from.name}{' '}
                      <span className='font-normal text-gray-600'>
                        {msg.from.address}
                      </span>
                    </p>
                    <p className=' text-gray-600 hover:text-green-600 hover:underline flex gap-2 justify-between'>
                      {msg.subject}
                      <ChevronRight />
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {openedMsg && (
          <div className='my-2 p-4 border-2 text-wrap border-gray-200 shadow-md rounded-lg line-clamp-none'>
            <p>{openedMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
