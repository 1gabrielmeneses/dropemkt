import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-center">
        Welcome to <span className="text-primary">Dropê Analytics</span>
      </h1>
      <p className="mt-6 max-w-2xl text-center text-lg text-muted-foreground">
        The ultimate marketplace for digital assets.
      </p>
      <div className="mt-10 flex gap-4">
        <Button size="lg">Get Started</Button>
        <Button variant="outline" size="lg">Learn More</Button>
      </div>
    </div>
  );
}
