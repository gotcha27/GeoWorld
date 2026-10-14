
 // Récupère les catégories de quiz depuis la base de données.
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";

export class categoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async all() {
    return await this.categoryRepository.find({
      order: { categoryId: "ASC" },
    });
  }
}
