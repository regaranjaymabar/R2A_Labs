import RecommendationForm from "../components/ui/RecommendationForm";

export default function Recommendation() {
  return (
    <div className="pt-35 min-h-screen ">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">
          
          <h1 className="text-6xl font-bold mt-8">
            Temukan Laptop
            <br />
            Sesuai Kebutuhanmu
          </h1>

          <p className="mt-6 text-zinc-600 max-w-2xl mx-auto">
            Jawab beberapa pertanyaan sederhana dan sistem
            akan memberikan rekomendasi laptop terbaik.
          </p>
        </div>

        <RecommendationForm />

      </div>
    </div>
  );
}