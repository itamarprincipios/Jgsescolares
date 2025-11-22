-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PROFESSOR',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "schoolId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "director" TEXT,
    "phone" TEXT,
    "logo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Modality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "allowsMixed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "maxAge" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "rg" TEXT,
    "photo" TEXT,
    "documentPhoto" TEXT,
    "guardianPhone" TEXT,
    "gender" TEXT NOT NULL DEFAULT 'MALE',
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "gender" TEXT,
    "schoolId" TEXT NOT NULL,
    "modalityId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Team_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Team_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "Modality" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Team_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ModalityToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ModalityToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Modality" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ModalityToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CategoryToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TeamStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TeamStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TeamStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_ModalityToStudent_AB_unique" ON "_ModalityToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ModalityToStudent_B_index" ON "_ModalityToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToStudent_AB_unique" ON "_CategoryToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToStudent_B_index" ON "_CategoryToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamStudents_AB_unique" ON "_TeamStudents"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamStudents_B_index" ON "_TeamStudents"("B");
