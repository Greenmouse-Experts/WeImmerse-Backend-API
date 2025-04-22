class InstitutionStatsService {
  /**
   * Get statistics for an institution user
   */
  static async getStatistics(userId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;

    const [totalStudents, boughtCourses, createdCourses, courseSales] =
      await Promise.all([0, 0, 0, 0]);

    return {
      totalStudents,
      boughtCourses,
      createdCourses,
      courseSales,
    };
  }
}

export default InstitutionStatsService;
