import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Billing from "./Billing";
import UserBilling from "./UserBilling";


export default function BillingRouter() {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return user.role === "ADMIN" ? <Billing /> : <UserBilling />;
}