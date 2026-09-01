import { AccountDirectoryScreen } from "@/components/account/account-directory-screen";

export default function RecipientsScreen() { return <AccountDirectoryScreen kind="recipients" title="Recipients" heading="People you send to" detail="Save a recipient to make future cargo bookings faster." itemLabel="Recipient name" itemDetail="City and phone number" icon="account-multiple-outline" />; }
