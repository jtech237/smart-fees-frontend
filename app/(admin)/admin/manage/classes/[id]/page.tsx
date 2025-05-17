import { DetailedClasse } from "@/components/classes/DetailedClasse";

export default function ClasseDetailsPage({params}: {params: {id: string}}) {
  return (
    <div className="p-6">
      <DetailedClasse id={Number(params.id)} />
    </div>
  );
}