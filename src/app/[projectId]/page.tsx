"use client"

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

interface TenantFormProps {
  projectId: string;
}

export const dynamic = 'force-dynamic';

export default function TenantForm({
  params,
}: {
  params: Promise<TenantFormProps>;
}) {
  const { projectId } = use(params);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // optional: if you want to do some navigation after success
  const router = useRouter();

  interface Project {
    name: string;
  }

  const [project, setProject] = useState<Project>({ name: "" });

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${projectId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching project with id: ${projectId}`);
      }
      return response.json();
    })
    .then((data) => {
      setProject(data);
    })
    .catch((err) => {
      console.error(err.message);
    });
  }, [projectId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, name }),
      });

      const tenant = await response.json();

      if (!response.ok) {
        throw new Error("Failed to create tenant");
      }

      // If success, handle as needed. E.g., route to a success page
      alert("Tenant created successfully!");
      router.push(`/info/${tenant.id}`);
    } catch (error: unknown) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

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
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          width: "300px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Signup Tenant
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
            Project Name
          </label>
          <input
            id="projectId"
            type="text"
            value={project?.name}
            disabled
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "#eee",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="name"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            background: "#0070f3",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Submit
        </button>
      </form>
    </main>
  );
}
