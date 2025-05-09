import { InviteUserEmail } from '@/emails/invite-user';
import { NextResponse } from 'next/server';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: 'dc504113095e093e1cd3744434222c28-a908eefc-b8bd012b', 
});

export async function POST(request: Request) {
  try {
    const { to, username, projectName, invitedByUsername, projectId, role } = await request.json();

    const subject = 'Invitation to join a project';
    const text = `Hello ${username},

You have been invited to join the project "${projectName}" by ${invitedByUsername}.
To join the project, click on the link below:

${request.headers.get('origin')}/invites/${projectId}?role=${role}`;

    const data = await mg.messages.create('sandbox25d0c613cc72466994ca35ee88c62890.mailgun.org', {
      from: 'ProjeX <postmaster@sandbox25d0c613cc72466994ca35ee88c62890.mailgun.org>',
      to: [to],
      subject,
      text,
    });

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error sending email with Mailgun:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}



