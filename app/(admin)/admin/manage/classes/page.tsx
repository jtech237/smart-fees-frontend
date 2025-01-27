"use client";

import { fetchData } from "@/lib/api-crud";
import { Classe, ClasseListResponse } from "@/types/classes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ClasseListPage(){
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState<Classe[]>([])


  useEffect(() => {
    async function loadClasses(){
      try {
        const data = await fetchData<ClasseListResponse>("/classes")
        const mappedClasses: Classe[] = data.data.map(classe => {
          return {
            id: classe.id,
            depth: classe.depth,
            name: classe.name,
            parent: classe.parent
          }
        })
        setClasses(mappedClasses)
      } catch (error) {
        console.error("Erreur lors de la récupération des classes", error)

      }finally{
        setLoading(false)
      }
    }

    loadClasses()
  }, [])

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold">
          Liste des classes
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li><Link href="/admin" className="font-medium">Dashboard</Link></li>
            <li className="font-medium text-primary">Gestion des classes</li>
          </ol>
        </nav>
      </div>

      {/* Table */}
      <table className="table-auto w-full border">
        <thead className="bg-primary">
          <tr>
            <th className="py-2">#</th>
            <th>Name</th>
            <th>Parent</th>
            <th>L</th>
          </tr>
        </thead>
          {loading ? (
            <tbody>
              <tr>
              <td colSpan={4} className="text-center">Chargement...</td>
            </tr>
            </tbody>
          ) : (
            <tbody>
              {classes.map(classe => (
                <tr key={`class-${classe.id}`}>
                  <td>{classe.id}</td>
                  <td>{classe.name}</td>
                  <td>{classe.parent?.name}</td>
                  <td>--</td>
                </tr>
              ))}
            </tbody>
          )}
      </table>
    </div>
  )
}

