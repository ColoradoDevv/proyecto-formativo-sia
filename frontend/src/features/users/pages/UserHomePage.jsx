import DashboardLayout from "../../../shared/layouts/DashboardLayout";
import UserListPage from "../../users/components/list/UserListPage";

export default function UserHomePage() {
    return (
        <DashboardLayout>
            <UserListPage />
        </DashboardLayout>
    );
}
