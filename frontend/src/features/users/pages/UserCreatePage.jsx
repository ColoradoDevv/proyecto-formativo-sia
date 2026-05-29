import DashboardLayout from "../../../shared/layouts/DashboardLayout";
import UserRegisterForm from "../components/create/UserRegisterForm";

export default function CreateUserPage() {
    return (
        <DashboardLayout>
            <UserRegisterForm />
        </DashboardLayout>
    );
}
