import json, os
from pymongo import MongoClient
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime

# MongoDB connection
mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']
todos_collection = db['todos']

class TodoListView(APIView):

    def get(self, request):
        todos = list(todos_collection.find())
        for todo in todos:
            todo['_id'] = str(todo['_id'])  # Convert ObjectId to string for JSON serialization
        return Response(todos, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            data = json.loads(request.body)
            description = data.get('description')
            if not description:
                return Response({'error': 'Description is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            todo = {
                'description': description,
                'created_at': datetime.now()
            }
            todos_collection.insert_one(todo)
            return Response({'message': 'Todo created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def health(request):
    """Health check endpoint"""
    return JsonResponse({"status": "healthy"})

