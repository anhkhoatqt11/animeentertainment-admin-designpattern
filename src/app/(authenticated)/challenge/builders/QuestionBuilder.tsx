// Question model
export interface Question {
  questionName: string;
  answers: string[];
  correctAnswerID: number;
  mediaUrl: string;
}

// Builder for Question object
export class QuestionBuilder {
  private question: Question;

  constructor() {
    this.question = {
      questionName: "",
      answers: ["", "", "", ""],
      correctAnswerID: 0,
      mediaUrl: "",
    };
  }

  setQuestionName(name: string): QuestionBuilder {
    this.question.questionName = name;
    return this;
  }

  setAnswers(answers: string[]): QuestionBuilder {
    this.question.answers = answers;
    return this;
  }

  setCorrectAnswerID(id: number): QuestionBuilder {
    this.question.correctAnswerID = id;
    return this;
  }

  setMediaUrl(url: string): QuestionBuilder {
    this.question.mediaUrl = url;
    return this;
  }

  build(): Question {
    return { ...this.question };
  }
}