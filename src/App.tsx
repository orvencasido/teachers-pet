import React, { useState } from 'react';
import { Navbar, TabKey } from './components/layout/Navbar';
import { ClassModal } from './components/classes/ClassModal';
import { StudentsView } from './components/students/StudentsView';
import { GradebookView } from './components/gradebook/GradebookView';
import { CalendarView } from './components/calendar/CalendarView';
import { LessonPlansView } from './components/lessons/LessonPlansView';
import { useClasses } from './hooks/useClasses';
import { useStudents } from './hooks/useStudents';
import { useGradebook } from './hooks/useGradebook';
import { useCalendar } from './hooks/useCalendar';
import { useLessonPlans } from './hooks/useLessonPlans';
import type { ClassInsert, ClassUpdate } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('students');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);

  // Classes & Section Management
  const {
    classes,
    selectedClassId,
    selectedClass,
    selectClass,
    addClass,
  } = useClasses();

  // Students Hook for the active class
  const {
    students,
    filteredStudents,
    status: studentsStatus,
    error: studentsError,
    searchQuery: studentSearch,
    setSearchQuery: setStudentSearch,
    addStudent,
    editStudent,
    removeStudent,
    retry: retryStudents,
  } = useStudents(selectedClassId);

  // Gradebook Hook
  const {
    assessments,
    filteredAssessments,
    studentSummaries,
    scoreMatrix,
    dirtyCells,
    hasDirtyCells,
    status: gradebookStatus,
    error: gradebookError,
    isSaving: isSavingGrades,
    filterType: assessmentFilter,
    setFilterType: setAssessmentFilter,
    updateScoreLocally,
    saveIndividualGrade,
    saveAllDirtyGrades,
    addAssessment,
    editAssessment,
    removeAssessment,
    retry: retryGradebook,
  } = useGradebook(selectedClassId, students);

  // Calendar Hook
  const {
    filteredEvents,
    upcomingEvents,
    status: calendarStatus,
    error: calendarError,
    currentMonth,
    filterType: calendarFilter,
    setFilterType: setCalendarFilter,
    nextMonth,
    prevMonth,
    goToToday,
    addEvent,
    editEvent,
    removeEvent,
    retry: retryCalendar,
  } = useCalendar(selectedClassId);

  // Lesson Plans Hook
  const {
    lessonPlans,
    filteredPlans,
    plansByStatus,
    units,
    status: lessonStatus,
    error: lessonError,
    filterStatus: lessonStatusFilter,
    setFilterStatus: setLessonStatusFilter,
    filterUnit: lessonUnitFilter,
    setFilterUnit: setLessonUnitFilter,
    searchQuery: lessonSearch,
    setSearchQuery: setLessonSearch,
    addPlan,
    editPlan,
    removePlan,
    retry: retryLessons,
  } = useLessonPlans(selectedClassId);

  const handleSaveClass = async (data: ClassInsert | ClassUpdate) => {
    await addClass(data as ClassInsert);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation Bar with Class Switcher */}
      <Navbar
        classes={classes}
        selectedClassId={selectedClassId}
        selectedClass={selectedClass}
        onSelectClass={selectClass}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewClass={() => setIsClassModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'students' && (
          <StudentsView
            students={students}
            filteredStudents={filteredStudents}
            status={studentsStatus}
            error={studentsError}
            searchQuery={studentSearch}
            onSearchChange={setStudentSearch}
            onAddStudent={addStudent}
            onEditStudent={editStudent}
            onRemoveStudent={removeStudent}
            onRetry={retryStudents}
            currentClass={selectedClass}
          />
        )}

        {activeTab === 'gradebook' && (
          <GradebookView
            assessments={assessments}
            filteredAssessments={filteredAssessments}
            students={students}
            studentSummaries={studentSummaries}
            scoreMatrix={scoreMatrix}
            dirtyCells={dirtyCells}
            hasDirtyCells={hasDirtyCells}
            status={gradebookStatus}
            error={gradebookError}
            isSaving={isSavingGrades}
            filterType={assessmentFilter}
            setFilterType={setAssessmentFilter}
            onUpdateScore={updateScoreLocally}
            onSaveIndividualGrade={saveIndividualGrade}
            onSaveAllDirtyGrades={saveAllDirtyGrades}
            onAddAssessment={addAssessment}
            onEditAssessment={editAssessment}
            onRemoveAssessment={removeAssessment}
            onRetry={retryGradebook}
            currentClass={selectedClass}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            filteredEvents={filteredEvents}
            upcomingEvents={upcomingEvents}
            status={calendarStatus}
            error={calendarError}
            currentMonth={currentMonth}
            filterType={calendarFilter}
            setFilterType={setCalendarFilter}
            onNextMonth={nextMonth}
            onPrevMonth={prevMonth}
            onToday={goToToday}
            onAddEvent={addEvent}
            onEditEvent={editEvent}
            onRemoveEvent={removeEvent}
            onRetry={retryCalendar}
            currentClass={selectedClass}
          />
        )}

        {activeTab === 'lessons' && (
          <LessonPlansView
            lessonPlans={lessonPlans}
            filteredPlans={filteredPlans}
            plansByStatus={plansByStatus}
            units={units}
            status={lessonStatus}
            error={lessonError}
            filterStatus={lessonStatusFilter}
            setFilterStatus={setLessonStatusFilter}
            filterUnit={lessonUnitFilter}
            setFilterUnit={setLessonUnitFilter}
            searchQuery={lessonSearch}
            setSearchQuery={setLessonSearch}
            onAddPlan={addPlan}
            onEditPlan={editPlan}
            onRemovePlan={removePlan}
            onRetry={retryLessons}
            currentClass={selectedClass}
          />
        )}
      </main>

      {/* Class creation modal */}
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSave={handleSaveClass}
      />
    </div>
  );
};

export default App;
