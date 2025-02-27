"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export const dynamic = "force-dynamic";

interface Tenant {
  name: string;
  domain: string;
}

interface InfoFormProps {
  tenantId: string;
}

export default function InfoForm({
  params,
}: {
  params: Promise<InfoFormProps>;
}) {
  const { tenantId } = use(params);
  const [tenant, setTenant] = useState<Tenant>({ name: "", domain: "" });

  useEffect(() => {
    fetch(`https://backend.blvhn.online/tenants/${tenantId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching project with id: ${tenantId}`);
        }
        return response.json();
      })
      .then((data) => {
        setTenant(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, [tenantId]);

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f7f7f7",
      }}
    >
      <form
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          width: "600px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Welcome {tenant.name}!
        </h1>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="projectId"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Your Tenant Url
          </label>
          <Link
            target="_blank"
            href={`https://${tenant.domain}`}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            {tenant.domain}
          </Link>
        </div>
      </form>
    </main>
  );
}
