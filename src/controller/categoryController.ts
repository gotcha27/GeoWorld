
 // Gère les requêtes HTTP liées aux catégories de quiz.
import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../utils/errorUtils";
import { categoryService } from "../service/categoryService";

export class categoryController {
  private CategoryService = new categoryService();

  async all(request: Request, response: Response, next: NextFunction) {
    try {
      return await this.CategoryService.all();
    } catch (error) {
      return getErrorMessage(error);
    }
  }
}
