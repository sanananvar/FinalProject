using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CA.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixedSurveyTableName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Statisfactions_Surveyss_SurveyId",
                table: "Statisfactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Surveyss_ContactSources_ContactSourceId",
                table: "Surveyss");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Surveyss",
                table: "Surveyss");

            migrationBuilder.RenameTable(
                name: "Surveyss",
                newName: "Surveys");

            migrationBuilder.RenameIndex(
                name: "IX_Surveyss_ContactSourceId",
                table: "Surveys",
                newName: "IX_Surveys_ContactSourceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Surveys",
                table: "Surveys",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Statisfactions_Surveys_SurveyId",
                table: "Statisfactions",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Surveys_ContactSources_ContactSourceId",
                table: "Surveys",
                column: "ContactSourceId",
                principalTable: "ContactSources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Statisfactions_Surveys_SurveyId",
                table: "Statisfactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Surveys_ContactSources_ContactSourceId",
                table: "Surveys");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Surveys",
                table: "Surveys");

            migrationBuilder.RenameTable(
                name: "Surveys",
                newName: "Surveyss");

            migrationBuilder.RenameIndex(
                name: "IX_Surveys_ContactSourceId",
                table: "Surveyss",
                newName: "IX_Surveyss_ContactSourceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Surveyss",
                table: "Surveyss",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Statisfactions_Surveyss_SurveyId",
                table: "Statisfactions",
                column: "SurveyId",
                principalTable: "Surveyss",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Surveyss_ContactSources_ContactSourceId",
                table: "Surveyss",
                column: "ContactSourceId",
                principalTable: "ContactSources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
