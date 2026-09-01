import { AccountDirectoryScreen } from "@/components/account/account-directory-screen";

export default function SavedPlacesScreen() { return <AccountDirectoryScreen kind="places" title="Saved places" heading="Your frequent stops" detail="Keep pickup and destination details ready for a future booking." itemLabel="Place name" itemDetail="Address or area" icon="map-marker-outline" />; }
