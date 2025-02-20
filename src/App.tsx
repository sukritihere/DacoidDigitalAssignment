import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuizScene } from "@/components/QuizScene";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { quizQuestions } from "@/lib/quiz-data";
import { QuizDatabase } from "@/lib/db";
import { Menu, Trophy, Clock, CheckCircle2 } from "lucide-react";

interface QuizAttempt {
  date: string;
  score: number;
  totalQuestions: number;
}

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [db] = useState(() => new QuizDatabase());

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        const savedAttempts = await db.getAttempts();
        setAttempts(savedAttempts);
      } catch (error) {
        console.error("Failed to load attempts:", error);
      }
    };
    loadAttempts();
  }, [db]);

  useEffect(() => {
    let timer: number;
    if (quizStarted && !showResults && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (currentQuestion < quizQuestions.length - 1) {
              setCurrentQuestion((prev) => prev + 1);
              return 30;
            } else {
              finishQuiz();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, showResults, currentQuestion, timeLeft]);

  useEffect(() => {
    if (quizStarted) {
      setIsOpen(false);
    }
  }, [quizStarted]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeLeft(30);
    setShowResults(false);
    setInputValue("");
    setIsOpen(false);
  };

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
      setInputValue("");
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const score = answers.reduce((acc, answer, index) => {
      return answer === quizQuestions[index].correctAnswer ? acc + 1 : acc;
    }, 0);

    const attempt = {
      date: new Date().toLocaleString(),
      score,
      totalQuestions: quizQuestions.length,
    };

    try {
      await db.saveAttempt(attempt);
      setAttempts([...attempts, attempt]);
    } catch (error) {
      console.error("Failed to save attempt:", error);
    }

    setShowResults(true);
    setQuizStarted(false);
  };

  const toggleSidebar = () => {
    if (!quizStarted) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="quiz-theme">
      <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
        <QuizScene />

        <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-background/90 backdrop-blur-md z-20 shadow-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={`transition-opacity ${
              quizStarted ? "opacity-50 cursor-not-allowed" : "hover:bg-accent"
            }`}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div
            className={`transition-opacity ${
              quizStarted ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <ThemeToggle />
          </div>
        </header>

        <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm z-10">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left" className="w-[400px]">
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-bold mb-6">Attempt History</h2>
                <ScrollArea className="flex-1 -mx-4 px-4">
                  {attempts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No attempts yet. Start a quiz to see your history!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {attempts.map((attempt, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-primary" />
                              <span className="font-semibold">
                                Score: {attempt.score}/{attempt.totalQuestions}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {attempt.date}
                            </div>
                          </div>
                          <Progress
                            value={
                              (attempt.score / attempt.totalQuestions) * 100
                            }
                            className="h-2 mt-2"
                          />
                          <div className="mt-2 text-sm text-muted-foreground">
                            {(
                              (attempt.score / attempt.totalQuestions) *
                              100
                            ).toFixed(0)}
                            % correct
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
          {/* <div className={quizStarted ? "opacity-50 pointer-events-none" : ""}>
            <ThemeToggle />
          </div> */}
        </header>

        <main className="relative z-10 w-full min-h-screen px-4 pt-20 pb-8">
          <div className="container mx-auto">
            {!quizStarted && !showResults ? (
              <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
                <h1 className="text-4xl font-bold mb-8">
                  Interactive Quiz Platform
                </h1>
                <Button onClick={startQuiz} size="lg" className="px-8">
                  Start Quiz
                </Button>
                {attempts.length > 0 && (
                  <p className="text-muted-foreground mt-4">
                    Previous best score:{" "}
                    {Math.max(...attempts.map((a) => a.score))}/
                    {quizQuestions.length}
                  </p>
                )}
              </div>
            ) : showResults ? (
              <div className="max-w-md mx-auto space-y-4">
                <Card className="p-6">
                  <div className="text-center mb-6">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h2 className="text-2xl font-bold">Quiz Complete!</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-lg font-semibold text-center">
                        Final Score:{" "}
                        {answers.reduce((acc, answer, index) => {
                          return answer === quizQuestions[index].correctAnswer
                            ? acc + 1
                            : acc;
                        }, 0)}
                        /{quizQuestions.length}
                      </p>
                      <Progress
                        value={
                          (answers.reduce((acc, answer, index) => {
                            return answer === quizQuestions[index].correctAnswer
                              ? acc + 1
                              : acc;
                          }, 0) /
                            quizQuestions.length) *
                          100
                        }
                        className="mt-2"
                      />
                    </div>

                    <Button onClick={startQuiz} className="w-full">
                      Try Again
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsOpen(true)}
                    >
                      View History
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-4">
                <Card className="p-6">
                  <div className="mb-4">
                    <Progress value={(timeLeft / 30) * 100} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Time left: {timeLeft} seconds
                    </p>
                  </div>

                  <h2 className="text-xl font-semibold mb-4">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </h2>

                  <p className="mb-6">
                    {quizQuestions[currentQuestion].question}
                  </p>

                  {quizQuestions[currentQuestion].type === "multiple-choice" ? (
                    <div className="grid grid-cols-1 gap-3">
                      {quizQuestions[currentQuestion].options?.map(
                        (option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start h-auto py-4 px-6"
                            onClick={() =>
                              handleAnswer(String.fromCharCode(65 + index))
                            }
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </Button>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Input
                        type="number"
                        placeholder="Enter your answer"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && inputValue) {
                            handleAnswer(parseInt(inputValue, 10));
                          }
                        }}
                      />
                      <Button
                        className="w-full"
                        onClick={() => {
                          if (inputValue) {
                            handleAnswer(parseInt(inputValue, 10));
                          }
                        }}
                      >
                        Next Question
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
