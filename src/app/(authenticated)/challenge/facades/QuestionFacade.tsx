import { useChallenge } from "@/hooks/useChallenge";
import { useUploadThing } from "@/lib/uploadthing";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
import { Question } from "../builders/QuestionBuilder";

// Facade for handling file uploads and question operations
export class QuestionFacade {
  private startUpload: any;
  private addQuestion: ReturnType<typeof useChallenge>["addQuestion"];
  private router: AppRouterInstance;

  constructor(
    startUpload: any,
    addQuestion: ReturnType<typeof useChallenge>["addQuestion"],
    router: AppRouterInstance
  ) {
    this.startUpload = startUpload;
    this.addQuestion = addQuestion;
    this.router = router;
  }

  async uploadImage(questionImage: any[]): Promise<string> {
    if (questionImage.length === 0) {
      return "";
    }

    const [questionImg] = await Promise.all([
      this.startUpload([...questionImage]).then((res) => {
        const formattedImages = res?.map((image) => ({
          id: image.key,
          name: image.key.split("_")[1] ?? image.key,
          url: image.url,
        }));
        return formattedImages ?? null;
      }),
    ]);

    return questionImg ? questionImg[0]?.url : "";
  }

  async addNewQuestion(question: Question): Promise<void> {
    await this.addQuestion(question).then((res) => {
      toast.success("Thêm câu hỏi thành công");
      this.router.push("/challenge");
    });
  }

  validateQuestion(question: Question, hasImage: boolean): boolean {
    if (!hasImage) {
      toast.error("Câu hỏi bắt buộc phải có ảnh minh họa");
      return false;
    }

    if (question.questionName === "") {
      toast.error("Vui lòng nhập câu hỏi");
      return false;
    }

    if (question.answers.filter((i) => i === "").length > 0) {
      toast.error("Vui lòng nhập đầy đủ câu trả lời");
      return false;
    }

    return true;
  }
}