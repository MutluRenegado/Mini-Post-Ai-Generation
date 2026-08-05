import test from 'node:test';
import assert from 'node:assert/strict';
import { SubjectInteractionEngine } from '../lib/ai-image-generator/images/SubjectInteractionEngine';

test('Level 35: Subject Relationship and Scene Interaction Test Suite', async (t) => {
  await t.test('1. Resolves solitary focused work interaction', () => {
    const result = SubjectInteractionEngine.resolve({
      primarySubject: 'Software Engineer',
      action: 'coding on workstation',
    });

    assert.equal(result.interactionIntent, 'focused_solitary_work');
    assert.equal(result.gazeDirection, 'focused_on_task_object');
    assert.equal(result.collisionAvoidanceVerified, true);
  });

  await t.test('2. Resolves collaborative discussion when secondary subjects exist', () => {
    const result = SubjectInteractionEngine.resolve({
      primarySubject: 'Project Manager',
      secondarySubjects: ['Lead Developer'],
      action: 'discussing sprint goal',
    });

    assert.equal(result.interactionIntent, 'collaborative_discussion');
    assert.equal(result.gazeDirection, 'looking_at_collaborator');
    assert.equal(result.relationships.length, 1);
  });

  await t.test('3. Detects contradictory interaction instructions', () => {
    const result = SubjectInteractionEngine.resolve({
      primarySubject: 'Developer',
      action: 'typing code on mechanical keyboard while holding coffee in both hands',
    });

    assert.equal(result.collisionAvoidanceVerified, false);
    assert.ok(result.contradictionWarnings !== undefined);
  });
});
