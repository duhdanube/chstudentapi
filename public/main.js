$(() => {
  $('#btnViewDirectory').click(viewStudents);
  $('#btnAddStudent').click(addStudent);
  $('#currentDirectory').on('click', 'button.edit', openEditModal);
  $('#btnUpdate').click(updateStudent);
  $('#currentDirectory').on('click', 'button.delete', openDeleteModal);
  $('#btnDelete').click(deleteStudent);
})

function displayStudents() {
  $('#currentDirectory').empty();
  $.get('/students')
    .done(data => {
      const $people = data.map(person => {
        let $entry = $('#template').clone();
        $entry.removeAttr('id');
        $entry.find('.studentName').text(person.name);
        $entry.find('.studentCohort').text(person.cohort);
        $entry.find('.studentGender').text(person.gender);
        $entry.find('button.edit').data('student-id', person.id);
        return $entry;
      })
      $('#currentDirectory').append($people);
    })
    .fail(err => {
      console.error('error: ', err);
    })
}


function viewStudents(e) {
  e.preventDefault();
  displayStudents();
}

function addStudent(e) {
  e.preventDefault();

  let $newName = $('#iptName').val();
  let $newCohort = $('#iptCohort').val();
  let $newGender = $('#iptGender').val();

  let newObj = {name: $newName, cohort: $newCohort, gender: $newGender};

  $.post('/students', newObj)
  .done(givenID => {
    console.log(givenID);
    displayStudents();
  })
  .fail(err => {
    console.error('error: ', err);
  });
}

let $id;

function openEditModal() {
  $id = $(this).data('student-id');
  $.get(`/students/${$id}`)
    .done(data => {
      $('#studentEditModal').find('#editName').val(data.name);
      $('#studentEditModal').find('#editCohort').val(data.cohort);
      $('#studentEditModal').find('#editGender').val(data.gender);
      $('#studentEditModal').modal();
    })
}

function updateStudent(e) {
  e.preventDefault();

  let $updateName = $('#studentEditModal').find('#editName').val();
  let $updateCohort = $('#studentEditModal').find('#editCohort').val();
  let $updateGender = $('#studentEditModal').find('#editGender').val();
  let updateStudent = {name: $updateName, cohort: $updateCohort, gender: $updateGender, id: $id};
  console.log(updateStudent);
  $.ajax({
  url: `/students/${$id}`,
  type: 'PUT',
  data: updateStudent,
  success: function(data) {
    console.log('Student updated successfully.');
    displayStudents();
  },
  error: function(data) {
    console.error('error: ', data);
  }
});
}

let $deleteID

function openDeleteModal() {
  $deleteID = $(this).data('student-id');
  $.get(`/students/${$deleteID}`)
    .done(data => {
      $('#studentDeleteModal').modal();
    })
}

function deleteStudent() {
  //let $deleteId = $(this).find('button.delete').data('student-id');
  $.ajax({
    url: `/students/${$deleteID}`,
    type: 'DELETE',
    success: function(data) {
      console.log('Student deleted successfully.');
      displayStudents();
    },
    error: function(data) {
      console.error('error', data);
    }
  })
}
