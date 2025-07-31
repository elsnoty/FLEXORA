"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner";
import { Trainer } from "@/Types/profiles";
import Link from "next/link";

export default function SearchTraineeBar({ asChild = false }: { asChild?: boolean }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const searchTrainers = async () => {
      if (!searchQuery.trim()) {
        setTrainers([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/trainers/search?query=${encodeURIComponent(searchQuery)}`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error(response.statusText);
        
        const data = await response.json();
        console.log(data);
        if (!Array.isArray(data)) throw new Error('Invalid data format');
        
        setTrainers(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Search failed');
          setTrainers([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };
    //debounce the search to avoid too many requests if we type jhon without debounce we will have 4 requests it 
    // 'jhon' 'jo' 'joh' 'joh' but with debounce we will have 1 request 'jhon'
    const debounceTimer = setTimeout(searchTrainers, 300);
    
    return () => {
      controller.abort();
      clearTimeout(debounceTimer);
    };
  }, [searchQuery]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground border w-full p-2 rounded-md cursor-pointer hover:bg-accent transition-colors">
          <Search className="h-4 w-4" />
          Search Trainers
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search for Trainers</DialogTitle>
          <DialogDescription>Find trainers by name, specialization, or rate</DialogDescription>
        </DialogHeader>
        
        <Input
          autoFocus
          placeholder="Type trainer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center items-center gap-2 py-4">
              <Spinner />
              <span>Searching trainers...</span>
            </div>
          ) : trainers.length > 0 ? (
            trainers.map((trainer) => (
              <Link href={`/trainee/suggestion/${trainer.user_id}`} key={trainer.user_id} onClick={() => setOpen(false)}>
                <TrainerCard trainer={trainer} />
              </Link>
            ))
          ) : searchQuery ? (
            <div className="text-center py-4 text-muted-foreground">
              No trainers found for &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Start typing to search trainers
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TrainerCard({ trainer }: { trainer: Trainer }) {

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors">
      <Avatar>
        <AvatarImage src={trainer.profiles.avatar_url || undefined} />
        <AvatarFallback>
          {trainer.profiles.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{trainer.profiles.name}</h4>
        <p className="text-sm text-muted-foreground truncate">
          {trainer.specialization} • ${trainer.hourly_rate}/hr
        </p>
      </div>
      <Button 
        size="sm" 
        variant="outline" 
        className="shrink-0">
        View
      </Button>
    </div>
  );
}